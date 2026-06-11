package com.watch.service.controller;

import com.watch.service.dto.WearingCalendarDTO;
import com.watch.service.service.WearingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wearing")
@RequiredArgsConstructor
public class WearingController {

    private final WearingService wearingService;

    @GetMapping("/watch/{watchId}")
    public ResponseEntity<List<WearingCalendarDTO>> listByWatch(@PathVariable Long watchId) {
        return ResponseEntity.ok(wearingService.findByWatchId(watchId));
    }

    @PostMapping
    public ResponseEntity<WearingCalendarDTO> record(@RequestBody WearingCalendarDTO dto) {
        return ResponseEntity.ok(wearingService.record(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        wearingService.delete(id);
        return ResponseEntity.ok().build();
    }
}
