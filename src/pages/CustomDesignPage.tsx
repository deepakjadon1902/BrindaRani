import CustomDesignSection from '@/components/user/CustomDesignSection';

const CustomDesignPage = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section className="py-12 md:py-16 bg-gradient-sacred text-white">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4">
            ✨ Special Service
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            Custom Design Orders
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Can't find what you're looking for? Share your vision and our Vrindavan artisans will bring it to life.
          </p>
        </div>
      </section>

      {/* Custom Design Form */}
      <CustomDesignSection />
    </div>
  );
};

export default CustomDesignPage;
