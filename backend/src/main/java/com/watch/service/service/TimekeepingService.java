package com.watch.service.service;

import com.watch.service.dto.TimekeepingRecordDTO;
import com.watch.service.entity.TimekeepingRecord;
import com.watch.service.repository.TimekeepingRecordRepository;
import com.watch.service.repository.WatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TimekeepingService {

    private final TimekeepingRecordRepository timekeepingRecordRepository;
    private final WatchRepository watchRepository;

    public List<TimekeepingRecordDTO> findByWatchId(Long watchId) {
        return timekeepingRecordRepository.findByWatchIdOrderByRecordDateDesc(watchId).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<TimekeepingRecordDTO> findByWatchIdAndDateRange(Long watchId, LocalDate start, LocalDate end) {
        return timekeepingRecordRepository.findByWatchIdAndRecordDateBetweenOrderByRecordDateAsc(watchId, start, end).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public TimekeepingRecordDTO save(TimekeepingRecordDTO dto) {
        watchRepository.findById(dto.getWatchId())
                .orElseThrow(() -> new RuntimeException("Watch not found: " + dto.getWatchId()));

        Optional<TimekeepingRecord> existing = timekeepingRecordRepository
                .findByWatchIdOrderByRecordDateDesc(dto.getWatchId()).stream()
                .filter(r -> r.getRecordDate().equals(dto.getRecordDate()))
                .findFirst();

        TimekeepingRecord record;
        if (existing.isPresent()) {
            record = existing.get();
            record.setDeviationSeconds(dto.getDeviationSeconds());
            record.setNote(dto.getNote());
        } else {
            record = toEntity(dto);
        }
        TimekeepingRecord saved = timekeepingRecordRepository.save(record);
        return toDTO(saved);
    }

    @Transactional
    public void delete(Long id) {
        timekeepingRecordRepository.deleteById(id);
    }

    public String getDeviationStatus(BigDecimal deviation) {
        if (deviation == null) {
            return "未知";
        }
        if (deviation.compareTo(new BigDecimal("-10")) >= 0
                && deviation.compareTo(new BigDecimal("20")) <= 0) {
            return "正常";
        }
        return "偏差过大";
    }

    private TimekeepingRecordDTO toDTO(TimekeepingRecord record) {
        TimekeepingRecordDTO dto = new TimekeepingRecordDTO();
        dto.setId(record.getId());
        dto.setWatchId(record.getWatchId());
        dto.setRecordDate(record.getRecordDate());
        dto.setDeviationSeconds(record.getDeviationSeconds());
        dto.setNote(record.getNote());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }

    private TimekeepingRecord toEntity(TimekeepingRecordDTO dto) {
        TimekeepingRecord record = new TimekeepingRecord();
        record.setWatchId(dto.getWatchId());
        record.setRecordDate(dto.getRecordDate());
        record.setDeviationSeconds(dto.getDeviationSeconds());
        record.setNote(dto.getNote());
        return record;
    }
}
