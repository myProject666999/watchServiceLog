package com.watch.service.service;

import com.watch.service.dto.MaintenanceRecordDTO;
import com.watch.service.entity.MaintenanceRecord;
import com.watch.service.entity.Watch;
import com.watch.service.repository.MaintenanceRecordRepository;
import com.watch.service.repository.WatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final WatchRepository watchRepository;

    public List<MaintenanceRecordDTO> findByWatchId(Long watchId) {
        return maintenanceRecordRepository.findByWatchIdOrderByMaintenanceDateDesc(watchId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public MaintenanceRecordDTO create(MaintenanceRecordDTO dto) {
        Watch watch = watchRepository.findById(dto.getWatchId())
                .orElseThrow(() -> new RuntimeException("Watch not found: " + dto.getWatchId()));

        MaintenanceRecord record = toEntity(dto);
        MaintenanceRecord saved = maintenanceRecordRepository.save(record);

        if (watch.getLastMaintenanceDate() == null
                || dto.getMaintenanceDate().isAfter(watch.getLastMaintenanceDate())) {
            watch.setLastMaintenanceDate(dto.getMaintenanceDate());
            watchRepository.save(watch);
        }

        return toDTO(saved);
    }

    @Transactional
    public MaintenanceRecordDTO update(Long id, MaintenanceRecordDTO dto) {
        MaintenanceRecord record = maintenanceRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance record not found: " + id));
        record.setMaintenanceDate(dto.getMaintenanceDate());
        record.setMaintenanceType(dto.getMaintenanceType());
        record.setServiceProvider(dto.getServiceProvider());
        record.setCost(dto.getCost());
        record.setNote(dto.getNote());
        MaintenanceRecord saved = maintenanceRecordRepository.save(record);
        return toDTO(saved);
    }

    @Transactional
    public void delete(Long id) {
        maintenanceRecordRepository.deleteById(id);
    }

    private MaintenanceRecordDTO toDTO(MaintenanceRecord record) {
        MaintenanceRecordDTO dto = new MaintenanceRecordDTO();
        dto.setId(record.getId());
        dto.setWatchId(record.getWatchId());
        dto.setMaintenanceDate(record.getMaintenanceDate());
        dto.setMaintenanceType(record.getMaintenanceType());
        dto.setServiceProvider(record.getServiceProvider());
        dto.setCost(record.getCost());
        dto.setNote(record.getNote());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }

    private MaintenanceRecord toEntity(MaintenanceRecordDTO dto) {
        MaintenanceRecord record = new MaintenanceRecord();
        record.setWatchId(dto.getWatchId());
        record.setMaintenanceDate(dto.getMaintenanceDate());
        record.setMaintenanceType(dto.getMaintenanceType());
        record.setServiceProvider(dto.getServiceProvider());
        record.setCost(dto.getCost());
        record.setNote(dto.getNote());
        return record;
    }
}
