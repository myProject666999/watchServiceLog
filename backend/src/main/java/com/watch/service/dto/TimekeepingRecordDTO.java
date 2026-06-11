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
public class TimekeepingRecordDTO {

    private Long id;
    private Long watchId;
    private LocalDate recordDate;
    private BigDecimal deviationSeconds;
    private String note;
    private LocalDateTime createdAt;
}
