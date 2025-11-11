package com.mycompany.app.media;
// Abstract Factory contract: create a Media object by key
public interface MediaFactory {
    public Media createMedia(String name);
}
