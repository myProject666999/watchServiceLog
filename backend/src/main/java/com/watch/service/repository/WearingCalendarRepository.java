package com.watch.service.repository;

import com.watch.service.entity.WearingCalendar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WearingCalendarRepository extends JpaRepository<WearingCalendar, Long> {

    Optional<WearingCalendar> findByWatchIdAndWearDate(Long watchId, LocalDate wearDate);

    List<WearingCalendar> findByWatchIdOrderByWearDateDesc(Long watchId);

    List<WearingCalendar> findByWatchIdAndWearDateBetweenOrderByWearDateAsc(Long watchId, LocalDate start, LocalDate end);

    long countByWatchId(Long watchId);
}
