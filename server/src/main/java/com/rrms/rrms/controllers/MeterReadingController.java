package com.rrms.rrms.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rrms.rrms.models.MeterReading;
import com.rrms.rrms.services.IMeterReadingService;

@RestController
@RequestMapping("/api/meter-readings")
public class MeterReadingController {

    @Autowired
    private IMeterReadingService meterReadingService;

    @GetMapping("/motel/{motelId}")
    public ResponseEntity<List<MeterReading>> getAllByMotel(@PathVariable UUID motelId) {
        return ResponseEntity.ok(meterReadingService.getAllByMotel(motelId));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<MeterReading>> getAllByRoom(@PathVariable UUID roomId) {
        return ResponseEntity.ok(meterReadingService.getAllByRoom(roomId));
    }

    @PostMapping
    public ResponseEntity<MeterReading> save(@RequestBody MeterReading meterReading) {
        return ResponseEntity.ok(meterReadingService.save(meterReading));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        meterReadingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
