package com.mycompany.app.media.bookFACTORY;

import com.mycompany.app.media.Media;
import com.mycompany.app.media.MediaFactory;
import com.mycompany.app.media.bookFACTORY.BookTypes.PhysicalBook;

// Concrete Factory to create Book objects

public class BookFactory implements MediaFactory {

    @Override
    public Media createMedia(String name) {
        switch (name) {
            case "PhysicalBook":
                return new PhysicalBook();
            default:
                throw new IllegalArgumentException("Unknown media type: " + name);
        }
    }

}
