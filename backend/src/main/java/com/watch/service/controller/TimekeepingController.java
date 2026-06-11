package com.watch.service.controller;

import com.watch.service.dto.TimekeepingRecordDTO;
import com.watch.service.service.TimekeepingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timekeeping")
@RequiredArgsConstructor
public class TimekeepingController {

    private final TimekeepingService timekeepingService;

    @GetMapping("/watch/{watchId}")
    public ResponseEntity<List<TimekeepingRecordDTO>> listByWatch(@PathVariable Long watchId) {
        return ResponseEntity.ok(timekeepingService.findByWatchId(watchId));
    }

    @GetMapping("/watch/{watchId}/range")
    public ResponseEntity<List<TimekeepingRecordDTO>> listByRange(
            @PathVariable Long watchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(timekeepingService.findByWatchIdAndDateRange(watchId, start, end));
    }

    @PostMapping
    public ResponseEntity<TimekeepingRecordDTO> save(@RequestBody TimekeepingRecordDTO dto) {
        return ResponseEntity.ok(timekeepingService.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        timekeepingService.delete(id);
        return ResponseEntity.ok().build();
    }
}
