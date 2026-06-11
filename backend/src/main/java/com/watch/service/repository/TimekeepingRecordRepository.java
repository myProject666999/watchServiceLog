package com.watch.service.repository;

import com.watch.service.entity.TimekeepingRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TimekeepingRecordRepository extends JpaRepository<TimekeepingRecord, Long> {

    List<TimekeepingRecord> findByWatchIdOrderByRecordDateDesc(Long watchId);

    List<TimekeepingRecord> findByWatchIdAndRecordDateBetweenOrderByRecordDateAsc(Long watchId, LocalDate start, LocalDate end);
}
