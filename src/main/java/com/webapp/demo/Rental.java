package com.webapp.demo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "rental", schema = "dbo")
public class Rental {

    // เชื่อมกับ BoardGame
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id", referencedColumnName = "id")
    @JsonBackReference
    private Boardgame game;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "game_id", insertable = false, updatable = false)
    private Long gameId;

    private String gameName;
    private String tenantName;
    private String rentalDate;
    private String rentalPeriod;
    private String returnDueDate;
    private int rentalPrice;
    private String realReturnDate;
    private String annotation;     // เช่น "return late"
    private String fine;           // เช่น "100 bath"
    private String review;

    public Rental() {}

    public Rental(String gameName, Boardgame game, String tenantName, String rentalDate,
                          String rentalPeriod, String returnDueDate, int rentalPrice,
                          String realReturnDate, String annotation, String fine, String review) {
        this.gameName = gameName;
        this.game = game;
        this.tenantName = tenantName;
        this.rentalDate = rentalDate;
        this.rentalPeriod = rentalPeriod;
        this.returnDueDate = returnDueDate;
        this.realReturnDate = realReturnDate;
        this.annotation = annotation;
        this.fine = fine;
        this.review = review;
    }

    public Long getRentalId() {
        return id;
    }

    public void setRentalId(Long id) {
        this.id = id;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public String getGameName() {
        return gameName;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public String getTenantName() {
        return tenantName;
    }

    public void setTenantName(String tenantName) {
        this.tenantName = tenantName;
    }

    public String getRentalDate() {
        return rentalDate;
    }

    public void setRentalDate(String rentalDate) {
        this.rentalDate = rentalDate;
    }

    public String getRentalPeriod() {
        return rentalPeriod;
    }

    public void setRentalPeriod(String rentalPeriod) {
        this.rentalPeriod = rentalPeriod;
    }

    public String getReturnDueDate() {
        return returnDueDate;
    }

    public void setReturnDueDate(String returnDueDate) {
        this.returnDueDate = returnDueDate;
    }

    public int getRentalPrice() {
        return rentalPrice;
    }

    public void setRentalPrice(int rentalPrice) {
        this.rentalPrice = rentalPrice;
    }

    public String getRealReturnDate() {
        return realReturnDate;
    }

    public void setRealReturnDate(String realReturnDate) {
        this.realReturnDate = realReturnDate;
    }

    public String getAnnotation() {
        return annotation;
    }

    public void setAnnotation(String annotation) {
        this.annotation = annotation;
    }

    public String getFine() {
        return fine;
    }

    public void setFine(String fine) {
        this.fine = fine;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Boardgame getBoardGame() {
        return game;
    }

    public void setBoardGame(Boardgame game){
        this.game = game;
    }

    @Override
    public String toString() {
        return "DetailedRental{" +
                "rentalId=" + id +
                ", gameId=" + gameId +
                ", gameName=" + gameName +
                ", boardGame='" + game + '\'' +
                ", tenantName='" + tenantName + '\'' +
                ", rentalDate='" + rentalDate + '\'' +
                ", rentalPeriod='" + rentalPeriod + '\'' +
                ", returnDueDate='" + returnDueDate + '\'' +
                ", rentalPrice='" + rentalPrice + '\'' +
                ", realReturnDate='" + realReturnDate + '\'' +
                ", annotation='" + annotation + '\'' +
                ", fine='" + fine + '\'' +
                ", review='" + review + '\'' +
                '}';
    }
}

