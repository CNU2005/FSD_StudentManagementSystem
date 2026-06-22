package com.example.student;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/std_users")
public class UserController {
	private UserService userService;

	public UserController(UserService userService) {
		
		this.userService = userService;
	}
	@PostMapping()
	@ResponseStatus(HttpStatus.CREATED)
	public void save(@RequestBody User user)
	{
		userService.save(user);
	}
	@GetMapping("/{id}")
	public User find(@PathVariable Integer id)
	{
		return userService.find(id).get();
	}
	
	@GetMapping()
	public List<User> finadAll(){
		return userService.findAll();
	}
	
}