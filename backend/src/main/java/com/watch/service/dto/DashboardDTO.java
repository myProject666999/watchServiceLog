package com.watch.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

    private List<WatchAlert> maintenanceAlerts;
    private List<WatchAlert> wearingAlerts;
    private List<WatchSummary> watchSummaries;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WatchAlert {
        private Long watchId;
        private String brand;
        private String model;
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WatchSummary {
        private Long watchId;
        private String brand;
        private String model;
        private BigDecimal latestDeviation;
        private String deviationStatus;
        private Long wearingDays;
    }
}
