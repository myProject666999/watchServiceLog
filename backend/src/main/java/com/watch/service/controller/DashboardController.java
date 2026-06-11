package com.watch.service.controller;

import com.watch.service.dto.DashboardDTO;
import com.watch.service.dto.DashboardDTO.WatchAlert;
import com.watch.service.dto.DashboardDTO.WatchSummary;
import com.watch.service.entity.TimekeepingRecord;
import com.watch.service.entity.Watch;
import com.watch.service.repository.TimekeepingRecordRepository;
import com.watch.service.repository.WatchRepository;
import com.watch.service.repository.WearingCalendarRepository;
import com.watch.service.service.WatchService;
import com.watch.service.service.TimekeepingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final WatchService watchService;
    private final TimekeepingService timekeepingService;
    private final WatchRepository watchRepository;
    private final TimekeepingRecordRepository timekeepingRecordRepository;
    private final WearingCalendarRepository wearingCalendarRepository;

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard() {
        DashboardDTO dashboard = new DashboardDTO();

        List<WatchAlert> maintenanceAlerts = watchService.getMaintenanceAlert();
        dashboard.setMaintenanceAlerts(maintenanceAlerts);

        List<WatchAlert> wearingAlerts = watchService.getWearingAlert();
        dashboard.setWearingAlerts(wearingAlerts);

        List<WatchSummary> summaries = new ArrayList<>();
        List<Watch> watches = watchRepository.findAll();
        for (Watch watch : watches) {
            WatchSummary summary = new WatchSummary();
            summary.setWatchId(watch.getId());
            summary.setBrand(watch.getBrand());
            summary.setModel(watch.getModel());

            List<TimekeepingRecord> records = timekeepingRecordRepository
                    .findByWatchIdOrderByRecordDateDesc(watch.getId());
            if (!records.isEmpty()) {
                BigDecimal deviation = records.get(0).getDeviationSeconds();
                summary.setLatestDeviation(deviation);
                summary.setDeviationStatus(timekeepingService.getDeviationStatus(deviation));
            } else {
                summary.setLatestDeviation(null);
                summary.setDeviationStatus("无数据");
            }

            long wearingDays = wearingCalendarRepository.countByWatchId(watch.getId());
            summary.setWearingDays(wearingDays);

            summaries.add(summary);
        }
        dashboard.setWatchSummaries(summaries);

        return ResponseEntity.ok(dashboard);
    }
}
