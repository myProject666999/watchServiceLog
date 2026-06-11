package com.watch.service.controller;

import com.watch.service.dto.MaintenanceRecordDTO;
import com.watch.service.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping("/watch/{watchId}")
    public ResponseEntity<List<MaintenanceRecordDTO>> listByWatch(@PathVariable Long watchId) {
        return ResponseEntity.ok(maintenanceService.findByWatchId(watchId));
    }

    @PostMapping
    public ResponseEntity<MaintenanceRecordDTO> create(@RequestBody MaintenanceRecordDTO dto) {
        return ResponseEntity.ok(maintenanceService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceRecordDTO> update(@PathVariable Long id, @RequestBody MaintenanceRecordDTO dto) {
        return ResponseEntity.ok(maintenanceService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        maintenanceService.delete(id);
        return ResponseEntity.ok().build();
    }
}
