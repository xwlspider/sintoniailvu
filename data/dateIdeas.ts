export interface DateIdea {
    id: number;
    actividad: string;
    categoria: "Aventura" | "Relajación" | "Gastronomía" | "Creatividad";
    icono: string;
  }
  
  export const DATE_IDEAS: DateIdea[] = [
    { id: 1, actividad: "Cena temática de un país al azar",          categoria: "Gastronomía", icono: "🌎" },
    { id: 2, actividad: "Sesión de fotos en el centro de la ciudad", categoria: "Creatividad", icono: "📸" },
    { id: 3, actividad: "Pícnic al atardecer",                       categoria: "Aventura",    icono: "✨" },
    { id: 4, actividad: "Maratón de películas de nuestra infancia",  categoria: "Relajación",  icono: "🍿" },
    { id: 5, actividad: "Aprender una coreografía de TikTok juntos", categoria: "Creatividad", icono: "💃" },
    { id: 6, actividad: "Ir a un lugar donde nunca hayamos estado",  categoria: "Aventura",    icono: "📍" },
    { id: 7, actividad: "Juegos de mesa y apuestas románticas",      categoria: "Relajación",  icono: "🎲" },
    { id: 8, actividad: "Cocinar un postre complejo desde cero",     categoria: "Gastronomía", icono: "🍰" },
  ];
  
  export const getRandomDate = (): DateIdea =>
    DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)];