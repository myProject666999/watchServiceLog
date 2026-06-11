package com.watch.service.controller;

import com.watch.service.dto.WatchDTO;
import com.watch.service.service.WatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watches")
@RequiredArgsConstructor
public class WatchController {

    private final WatchService watchService;

    @GetMapping
    public ResponseEntity<List<WatchDTO>> list() {
        return ResponseEntity.ok(watchService.findAll());
    }

    @PostMapping
    public ResponseEntity<WatchDTO> create(@RequestBody WatchDTO dto) {
        return ResponseEntity.ok(watchService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WatchDTO> detail(@PathVariable Long id) {
        return ResponseEntity.ok(watchService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WatchDTO> update(@PathVariable Long id, @RequestBody WatchDTO dto) {
        return ResponseEntity.ok(watchService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        watchService.delete(id);
        return ResponseEntity.ok().build();
    }
}
