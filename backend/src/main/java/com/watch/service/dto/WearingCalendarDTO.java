package com.watch.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WearingCalendarDTO {

    private Long id;
    private Long watchId;
    private LocalDate wearDate;
    private LocalDateTime createdAt;
}
