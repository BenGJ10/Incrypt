package com.bengregory.notes.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DemoController {

    @GetMapping("/hello")
    public String welcome(){
        return "Hello Ben, Welcome to Incrypt!";
    }

    @GetMapping("/hackme")
    public String hackme(){
        return "Seriously? This is a Secure Spring app, you can't hack me!";
    }

    @GetMapping("/about")
    public String about(){
        return "This is a Secure Note-taking application build using Spring Security!";
    }
}
