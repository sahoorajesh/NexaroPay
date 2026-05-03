package com.user.service;

import com.user.dto.UserDTO;
import com.user.entity.User;
import com.user.repository.UserRepository;
import com.util.kafka.UserCreatedPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    @Autowired
    private RedisTemplate<String,UserDTO> redisTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${user.created.topic}")
    private String userCreatedTopic;

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
}
