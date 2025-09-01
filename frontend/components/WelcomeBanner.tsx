export function WelcomeBanner() {
    return (
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Demo Farmer!</h2>
        <p className="text-xl text-muted-foreground mb-2">
          Ready to help your plants grow healthy
        </p>
        <p className="text-muted-foreground">
          Upload a photo of your plant to get instant AI diagnosis and treatment recommendations
        </p>
      </div>
    );
  }