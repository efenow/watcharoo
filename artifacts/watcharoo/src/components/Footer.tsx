import tmdbLogoPath from "@assets/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9b_1782213410672.svg";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/50 py-8 md:py-12 mt-auto">
      <div className="container max-w-screen-2xl mx-auto px-4 text-center text-sm text-muted-foreground">
        © {currentYear} efenow.xyz. All film data is taken from{" "}
        <a href="https://themoviedb.org" target="_blank" rel="noreferrer">
          <img 
            src={tmdbLogoPath} 
            alt="TMDB" 
            style={{ height: '20px', filter: 'grayscale(100%) brightness(0.6)', display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} 
          />
        </a>{" "}
        with permission.
      </div>
    </footer>
  );
}