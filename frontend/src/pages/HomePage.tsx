const HomePage = () => {
  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-background'>
      <picture className='absolute inset-0 block h-full w-full'>
        <source
          media='(min-width: 1024px)'
          srcSet='/cookbook-hero-desktop@1x.webp 1x, /cookbook-hero-desktop@2x.webp 2x, /cookbook-hero-desktop@3x.webp 3x'
        />
        <source
          media='(min-width: 640px)'
          srcSet='/cookbook-hero-tablet@1x.webp 1x, /cookbook-hero-tablet@2x.webp 2x, /cookbook-hero-tablet@3x.webp 3x'
        />
        <img
          src='/cookbook-hero-mobile@1x.webp'
          srcSet='/cookbook-hero-mobile@1x.webp 1x, /cookbook-hero-mobile@2x.webp 2x, /cookbook-hero-mobile@3x.webp 3x'
          alt=''
          className='h-full w-full object-cover object-center'
        />
      </picture>
    </div>
  );
};

export default HomePage;
