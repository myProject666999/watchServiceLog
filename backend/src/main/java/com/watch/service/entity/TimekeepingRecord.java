package com.watch.service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "timekeeping_records", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"watch_id", "record_date"})
})
public class TimekeepingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "watch_id", nullable = false)
    private Long watchId;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal deviationSeconds;

    private String note;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
