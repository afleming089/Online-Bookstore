package com.mycompany.app.media.bookFACTORY.BookTypes;

import com.mycompany.app.media.Media;

public interface Book extends Media {
    public String getISBN();

    public void setISBN(String ISBN);
}