package com.watch.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatchDTO {

    private Long id;
    private String brand;
    private String model;
    private String movement;
    private Integer year;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;
    private LocalDate lastMaintenanceDate;
    private Integer maintenanceIntervalMonths;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
