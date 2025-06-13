package com.webapp.demo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "boardgame", schema = "dbo")
public class Boardgame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    // @JsonManagedReference
    // private List<Rental> rentals;

    private String gameName;
    private String types;
    private String numberOfPlayers;
    private String ageOfPlayers;
    private String difficultyLevel;
    private String playingTime;
    // private Boolean availability = Boolean.TRUE;
    private String discountDeposit;
    private String promotions;
    private String picture;
    private int stock;

    // @Lob
    // @Column(name = "picture", columnDefinition = "VARBINARY(MAX)")
    // private byte[] picture;

    public Boardgame() {}

    public Boardgame(String gameName, String types, String numberOfPlayers, String ageOfPlayers,
                           String difficultyLevel, String playingTime,
                           String discountDeposit, String promotions, String picture, int stock) {
        this.gameName = gameName;
        this.types = types;
        this.numberOfPlayers = numberOfPlayers;
        this.ageOfPlayers = ageOfPlayers;
        this.difficultyLevel = difficultyLevel;
        this.playingTime = playingTime;
        this.discountDeposit = discountDeposit;
        this.promotions = promotions;
        this.picture = picture;
        this.stock = stock;
    }

    // Getters and Setters
    public Long getGameId() {
        return id;
    }

    public void setGameId(Long id) {
        this.id = id;
    }

    public String getGameName() {
        return gameName;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public String getTypes() {
        return types;
    }

    public void setTypes(String types) {
        this.types = types;
    }

    public String getNumberOfPlayers() {
        return numberOfPlayers;
    }

    public void setNumberOfPlayers(String numberOfPlayers) {
        this.numberOfPlayers = numberOfPlayers;
    }

    public String getAgeOfPlayers() {
        return ageOfPlayers;
    }

    public void setAgeOfPlayers(String ageOfPlayers) {
        this.ageOfPlayers = ageOfPlayers;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getPlayingTime() {
        return playingTime;
    }

    public void setPlayingTime(String playingTime) {
        this.playingTime = playingTime;
    }

    // public boolean isAvailability() {
    //     return availability;
    // }

    // public void setAvailability(boolean availability) {
    //     this.availability = availability;
    // }

    public String getDiscountDeposit() {
        return discountDeposit;
    }

    public void setDiscountDeposit(String discountDeposit) {
        this.discountDeposit = discountDeposit;
    }

    public String getPromotions() {
        return promotions;
    }

    public void setPromotions(String promotions) {
        this.promotions = promotions;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    // public List<Rental> getRentals() {
    //     return rentals;
    // }

    // public void setRentals(List<Rental> rentals) {
    //     this.rentals = rentals;
    // }

    @Override
    public String toString() {
        return "BoardGame {" +
                "gameId=" + id +
                ", gameName='" + gameName + '\'' +
                ", types='" + types + '\'' +
                ", numberOfPlayers=" + numberOfPlayers +
                ", ageOfPlayers='" + ageOfPlayers + '\'' +
                ", difficultyLevel='" + difficultyLevel + '\'' +
                ", playingTime='" + playingTime + '\'' +
                // ", availability=" + availability +
                ", discountDeposit='" + discountDeposit + '\'' +
                ", promotions='" + promotions + '\'' +
                ", picture='" + picture + '\'' +
                ", stock=" + stock +
                '}';
    }
}
