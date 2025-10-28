package com.mycompany.app.media.book.BookTypes;

public class PhysicalBook implements Book {
    private String title;
    private String description;
    private String author;
    private String ISBN;
    private double price;

    // PhysicalBook(String title, String description, String author, String ISBN,
    // double price) {
    // this.title = title;
    // this.description = description;
    // this.author = author;
    // this.ISBN = ISBN;
    // this.price = price;
    // }

    // title
    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
    }

    // description
    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public void setDescription(String description) {
        this.description = description;
    }

    // author
    @Override
    public String getAuthor() {
        return author;
    }

    @Override
    public void setAuthor(String author) {
        this.author = author;
    }

    // price
    @Override
    public double getPrice() {
        return price;
    }

    @Override
    public void setPrice(double price) {
        this.price = price;
    }

    // ISBN
    @Override
    public String getISBN() {
        return ISBN;
    }

    @Override
    public void setISBN(String ISBN) {
        this.ISBN = ISBN;
    }

    @Override
    public String toString() {
        return "PhysicalBook {" +
                "Title='" + title + '\'' +
                ", Description='" + description + '\'' +
                ", Author='" + author + '\'' +
                ", ISBN='" + ISBN + '\'' +
                ", Price=" + price +
                '}';
    }
}
