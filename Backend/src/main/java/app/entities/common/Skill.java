package app.entities.common;

public class Skill {
    private String name;
    private double rating;

    public Skill(String name, double rating) {
        this.name = name;
        this.rating = rating;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    @Override
    public String toString() {
        return String.format("app.entities.common.Skill[name=%s, rating=%f]", name, rating);
    }

    public static class SkillInput {
        public String name;
        public double rating;

        public Skill toSkill() {
            return new Skill(this.name, rating);
        }
    }
}