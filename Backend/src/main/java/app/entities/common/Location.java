package app.entities.common;

public class Location {
    private double latitude;

    private double longitude;

    public Location(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public static class LocationInput {
        public double latitude;
        public double longitude;

        public Location toLocation() {
            return new Location(this.latitude, this.longitude);
        }
    }

}
