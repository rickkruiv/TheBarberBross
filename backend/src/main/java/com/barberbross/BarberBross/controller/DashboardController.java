package com.barberbross.BarberBross.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.barberbross.BarberBross.service.DashboardService;


@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public DashboardService.DashboardResponse getDashboard() {
        return dashboardService.gerarDashboard();
    }
}
