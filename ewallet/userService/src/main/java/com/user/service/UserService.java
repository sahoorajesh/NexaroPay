package com.user.service;

import com.user.dto.LoginRequestDTO;
import com.user.dto.LoginResponseDTO;
import com.user.dto.LogoutResponseDTO;
import com.user.dto.UserDTO;
import com.user.entity.User;
import com.user.repository.UserRepository;
import com.util.kafka.UserCreatedPayload;
import com.user.config.JWTUtil;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final RedisTemplate<String,UserDTO> redisTemplate;

    private final UserRepository userRepository;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private final JWTUtil jwtUtil;

    @Value("${user.created.topic}")
    private String userCreatedTopic;

    private static final String BEARER_PREFIX = "Bearer ";

    public UserService(RedisTemplate<String, UserDTO> redisTemplate, UserRepository userRepository, KafkaTemplate<String, Object> kafkaTemplate, JWTUtil jwtUtil) {
        this.redisTemplate = redisTemplate;
        this.userRepository = userRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.jwtUtil = jwtUtil;
    }

    public UserDTO getUserDetails(Long id){
        String key = "user" + id;
        UserDTO userDTO = redisTemplate.opsForValue().get(key);
        if(userDTO == null){
            User user = userRepository.findById(id).get();
            userDTO = toUserDTO(user);
        }
        return userDTO;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        String email = request == null ? null : request.getEmail();
        String kyc = request == null ? null : request.getKyc();

        if (isBlank(email) || isBlank(kyc)) {
            return LoginResponseDTO.builder()
                    .success(false)
                    .message("Both email and kyc are required.")
                    .build();
        }

        return userRepository.findByEmailAndKycNumber(email.trim(), kyc.trim())
                .map(user -> {

                    String token = jwtUtil.generateToken(
                            user.getId(),
                            user.getEmail()
                    );

                    return LoginResponseDTO.builder()
                            .success(true)
                            .message("Login successful.")
                            .userId(user.getId())
                            .user(toUserDTO(user))
                            .token(token)
                            .build();
                })
                .orElseGet(() -> LoginResponseDTO.builder()
                        .success(false)
                        .message("Invalid email or kyc.")
                        .build());
    }

    @Transactional
    public long createUser(UserDTO userDTO) throws ExecutionException, InterruptedException {

        User user = User.builder()
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .phone(userDTO.getPhone())
                .kycNumber(userDTO.getKycNumber())
                .build();
        user = userRepository.save(user);

        UserCreatedPayload userCreatedPayload = UserCreatedPayload.builder()
                .userName(user.getName())
                .userEmail(user.getEmail())
                .userId(user.getId())
                .requestId(MDC.get("requestId"))
                .build();
        Future<SendResult<String,Object>> future = kafkaTemplate
                .send(userCreatedTopic, userCreatedPayload.getUserEmail(),userCreatedPayload);

        logger.info("Sent message to Kafka topic: {}", future.get());
        String key = "user:" + user.getId();
        logger.info("Key: {}", key);
        logger.info("Putting data in Redis");
        redisTemplate.opsForValue().set(key,userDTO);
        return user.getId();
    }

    public LogoutResponseDTO logoutUser(String authHeader) {

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            return LogoutResponseDTO.builder()
                    .success(false)
                    .message("Invalid authorization header")
                    .build();
        }

        try {

            String token = authHeader.substring(BEARER_PREFIX.length());

            long remainingValidity = jwtUtil.getRemainingValidity(token);

            // Token already expired then treat as logged out
            if (remainingValidity <= 0) {

                return LogoutResponseDTO.builder()
                        .success(true)
                        .message("User already logged out")
                        .build();
            }
            return LogoutResponseDTO.builder()
                    .success(true)
                    .message("User logged out successfully")
                    .build();

        } catch (io.jsonwebtoken.ExpiredJwtException e) {

            return LogoutResponseDTO.builder()
                    .success(true)
                    .message("User already logged out")
                    .build();

        } catch (Exception e) {

            logger.error("Logout failed", e);
            return LogoutResponseDTO.builder()
                    .success(false)
                    .message("Logout failed")
                    .build();
        }
    }


    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static UserDTO toUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setName(user.getName());
        userDTO.setPhone(user.getPhone());
        userDTO.setKycNumber(user.getKycNumber());
        return userDTO;
    }
}
