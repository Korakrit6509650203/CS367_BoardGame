package com.webapp.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/rentals")
public class RentalController {

    private final RentalRepository rentalRepository;

    public RentalController(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    @GetMapping
    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Rental> getByIdRental(@PathVariable Long id) {
        return rentalRepository.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Rental createRental(@RequestBody Rental rental) {
        return rentalRepository.save(rental);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRental(@PathVariable Long id) {
        rentalRepository.deleteById(id);
    }

    @PatchMapping("/{rentalId}")
    public ResponseEntity<?> updateRental(
        @PathVariable Long rentalId, 
        @RequestBody Map<String, Object> updates
    ) {
        Optional<Rental> rental = rentalRepository.findById(rentalId);
        if (!rental.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rental not found.");
        }

        Rental rentalOpt = rental.get();
        // อัปเดตฟิลด์ที่ระบุเท่านั้น
        if (updates.containsKey("realReturnDate")) {
            rentalOpt.setRealReturnDate(updates.get("realReturnDate").toString());
        }
        if (updates.containsKey("lateFee")) {
            rentalOpt.setFine(updates.get("lateFee").toString());
        }

        rentalRepository.save(rentalOpt);
        return ResponseEntity.ok("Rental updated successfully.");
    }

}

