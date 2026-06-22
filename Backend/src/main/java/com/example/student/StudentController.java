package com.example.student;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/std_students")
public class StudentController {

    private StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@RequestBody Student student) {
        studentService.save(student);
    }

    @GetMapping("/{id}")
    public Student find(@PathVariable Integer id) {
        return studentService.find(id).orElse(null);
    }

    @GetMapping
    public List<Student> findAll() {
        return studentService.findAll();
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Integer id,
                       @RequestBody Student student) {
        student.setId(id);
        studentService.save(student);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        studentService.delete(id);
    }
}