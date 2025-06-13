package com.webapp.demo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    // ไม่ต้องเขียนโค้ดเพิ่มเติมสำหรับ CRUD พื้นฐาน
    @Query("SELECT r FROM Rental r JOIN FETCH r.game WHERE r.id = :id")
    Optional<Rental> findByIdWithGame(@Param("id") Long id);
}
