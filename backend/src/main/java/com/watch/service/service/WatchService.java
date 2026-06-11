package com.watch.service.service;

import com.watch.service.dto.WatchDTO;
import com.watch.service.dto.DashboardDTO.WatchAlert;
import com.watch.service.entity.Watch;
import com.watch.service.entity.WearingCalendar;
import com.watch.service.repository.WatchRepository;
import com.watch.service.repository.WearingCalendarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WatchService {

    private final WatchRepository watchRepository;
    private final WearingCalendarRepository wearingCalendarRepository;

    public List<WatchDTO> findAll() {
        return watchRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public WatchDTO findById(Long id) {
        Watch watch = watchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Watch not found: " + id));
        return toDTO(watch);
    }

    @Transactional
    public WatchDTO create(WatchDTO dto) {
        Watch watch = toEntity(dto);
        Watch saved = watchRepository.save(watch);
        return toDTO(saved);
    }

    @Transactional
    public WatchDTO update(Long id, WatchDTO dto) {
        Watch watch = watchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Watch not found: " + id));
        updateEntity(watch, dto);
        Watch saved = watchRepository.save(watch);
        return toDTO(saved);
    }

    @Transactional
    public void delete(Long id) {
        watchRepository.deleteById(id);
    }

    public List<WatchAlert> getMaintenanceAlert() {
        LocalDate today = LocalDate.now();
        List<Watch> allWatches = watchRepository.findAll();
        List<WatchAlert> alerts = new ArrayList<>();
        for (Watch watch : allWatches) {
            if (watch.getLastMaintenanceDate() != null) {
                long monthsSince = ChronoUnit.MONTHS.between(watch.getLastMaintenanceDate(), today);
                if (monthsSince > watch.getMaintenanceIntervalMonths()) {
                    alerts.add(new WatchAlert(
                            watch.getId(),
                            watch.getBrand(),
                            watch.getModel(),
                            "已超过保养周期" + monthsSince + "个月"
                    ));
                }
            }
        }
        return alerts;
    }

    public List<WatchAlert> getWearingAlert() {
        LocalDate today = LocalDate.now();
        List<Watch> allWatches = watchRepository.findAll();
        List<WatchAlert> alerts = new ArrayList<>();
        for (Watch watch : allWatches) {
            List<WearingCalendar> records = wearingCalendarRepository
                    .findByWatchIdOrderByWearDateDesc(watch.getId());
            if (records.isEmpty()) {
                alerts.add(new WatchAlert(
                        watch.getId(),
                        watch.getBrand(),
                        watch.getModel(),
                        "从未佩戴过"
                ));
            } else {
                LocalDate lastWearDate = records.get(0).getWearDate();
                long daysSince = ChronoUnit.DAYS.between(lastWearDate, today);
                if (daysSince > 7) {
                    alerts.add(new WatchAlert(
                            watch.getId(),
                            watch.getBrand(),
                            watch.getModel(),
                            "已" + daysSince + "天未佩戴"
                    ));
                }
            }
        }
        return alerts;
    }

    private WatchDTO toDTO(Watch watch) {
        WatchDTO dto = new WatchDTO();
        dto.setId(watch.getId());
        dto.setBrand(watch.getBrand());
        dto.setModel(watch.getModel());
        dto.setMovement(watch.getMovement());
        dto.setYear(watch.getYear());
        dto.setPurchaseDate(watch.getPurchaseDate());
        dto.setWarrantyExpiry(watch.getWarrantyExpiry());
        dto.setLastMaintenanceDate(watch.getLastMaintenanceDate());
        dto.setMaintenanceIntervalMonths(watch.getMaintenanceIntervalMonths());
        dto.setCreatedAt(watch.getCreatedAt());
        dto.setUpdatedAt(watch.getUpdatedAt());
        return dto;
    }

    private Watch toEntity(WatchDTO dto) {
        Watch watch = new Watch();
        updateEntity(watch, dto);
        return watch;
    }

    private void updateEntity(Watch watch, WatchDTO dto) {
        watch.setBrand(dto.getBrand());
        watch.setModel(dto.getModel());
        watch.setMovement(dto.getMovement());
        watch.setYear(dto.getYear());
        watch.setPurchaseDate(dto.getPurchaseDate());
        watch.setWarrantyExpiry(dto.getWarrantyExpiry());
        watch.setLastMaintenanceDate(dto.getLastMaintenanceDate());
        if (dto.getMaintenanceIntervalMonths() != null) {
            watch.setMaintenanceIntervalMonths(dto.getMaintenanceIntervalMonths());
        }
    }
}
