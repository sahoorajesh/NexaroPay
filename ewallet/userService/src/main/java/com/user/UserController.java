package com.user;

import com.user.dto.LoginRequestDTO;
import com.user.dto.LoginResponseDTO;
import com.user.dto.LogoutResponseDTO;
import com.user.dto.UserDTO;
import com.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/user-service")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/user")
    public long createUser(@RequestBody UserDTO userDTO) throws ExecutionException, InterruptedException {
        logger.info("createUser");
        return userService.createUser(userDTO);
    }

    @GetMapping("/user-details/{userId}")
    public UserDTO getUserDetails(@PathVariable Long userId) throws ExecutionException, InterruptedException {
        logger.info("getUserDetails for userId = {}" , userId);
        return userService.getUserDetails(userId);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        logger.info("login attempt for email={}", request == null ? null : request.getEmail());
        LoginResponseDTO response = userService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        // Missing fields -> 400, invalid credentials -> 401
        HttpStatus status = "Both email and kyc are required.".equals(response.getMessage())
                ? HttpStatus.BAD_REQUEST
                : HttpStatus.UNAUTHORIZED;
        return ResponseEntity.status(status).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponseDTO> logout( @RequestHeader("Authorization") String authHeader) {

        logger.info("Entered logout");

        LogoutResponseDTO response = userService.logoutUser(authHeader);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
