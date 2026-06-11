package com.watch.service.repository;

import com.watch.service.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {

    List<MaintenanceRecord> findByWatchIdOrderByMaintenanceDateDesc(Long watchId);
}
