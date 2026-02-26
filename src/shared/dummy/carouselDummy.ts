type Slide = {
    id: number;
    title: string;
    description: string;
    image: string;
    rating: number;
    chapters: number;
    rank: number;
    genre: string;
};

export const slides: Slide[] = [
    {
        id: 1,
        title: "Demonic Emperor",
        description:
            "Karena dia memiliki warisan Ancient Demonic emperor Zhuo Yifan menemukan nasib sial karena dikhianati...",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1606246963i/56034129.jpg",
        rating: 8.6,
        chapters: 822,
        rank: 9999,
        genre: "Manhua",
    },
    {
        id: 2,
        title: "Solo Leveling",
        description: "Hunter terlemah berubah menjadi yang terkuat...",
        image: "https://m.media-amazon.com/images/M/MV5BOWM2NzcxZjEtYjFjNC00NzQwLTg4MzQtMDZjYzcwMTdmYmY4XkEyXkFqcGc@._V1_.jpg",
        rating: 9.1,
        chapters: 200,
        rank: 1,
        genre: "Manhwa",
    },
];