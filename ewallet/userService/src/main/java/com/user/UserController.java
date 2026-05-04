package com.user;

import com.user.dto.UserDTO;
import com.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/user-service")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

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
}
