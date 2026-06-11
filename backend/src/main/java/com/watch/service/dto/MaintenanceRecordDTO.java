package com.watch.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRecordDTO {

    private Long id;
    private Long watchId;
    private LocalDate maintenanceDate;
    private String maintenanceType;
    private String serviceProvider;
    private BigDecimal cost;
    private String note;
    private LocalDateTime createdAt;
}
