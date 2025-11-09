const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-[9999]">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-muted-foreground border-t-primary rounded-full animate-spin" />

      {/* Loading Text */}
      <p className="mt-4 text-sm text-muted-foreground">
        Loading, please wait...
      </p>
    </div>
  );
};

export default FullPageLoader;
