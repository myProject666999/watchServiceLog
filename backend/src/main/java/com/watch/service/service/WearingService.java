package com.watch.service.service;

import com.watch.service.dto.WearingCalendarDTO;
import com.watch.service.entity.WearingCalendar;
import com.watch.service.repository.WearingCalendarRepository;
import com.watch.service.repository.WatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WearingService {

    private final WearingCalendarRepository wearingCalendarRepository;
    private final WatchRepository watchRepository;

    public List<WearingCalendarDTO> findByWatchId(Long watchId) {
        return wearingCalendarRepository.findByWatchIdOrderByWearDateDesc(watchId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public WearingCalendarDTO record(WearingCalendarDTO dto) {
        watchRepository.findById(dto.getWatchId())
                .orElseThrow(() -> new RuntimeException("Watch not found: " + dto.getWatchId()));

        return wearingCalendarRepository.findByWatchIdAndWearDate(dto.getWatchId(), dto.getWearDate())
                .map(this::toDTO)
                .orElseGet(() -> {
                    WearingCalendar entity = toEntity(dto);
                    WearingCalendar saved = wearingCalendarRepository.save(entity);
                    return toDTO(saved);
                });
    }

    @Transactional
    public void delete(Long id) {
        wearingCalendarRepository.deleteById(id);
    }

    private WearingCalendarDTO toDTO(WearingCalendar entity) {
        WearingCalendarDTO dto = new WearingCalendarDTO();
        dto.setId(entity.getId());
        dto.setWatchId(entity.getWatchId());
        dto.setWearDate(entity.getWearDate());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    private WearingCalendar toEntity(WearingCalendarDTO dto) {
        WearingCalendar entity = new WearingCalendar();
        entity.setWatchId(dto.getWatchId());
        entity.setWearDate(dto.getWearDate());
        return entity;
    }
}
