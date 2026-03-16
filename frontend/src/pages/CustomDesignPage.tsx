import customDesignBg from '@/assets/custom-design-bg.jpg';
import CustomDesignSection from '@/components/user/CustomDesignSection';

const CustomDesignPage = () => {
  return (
    <div>
      <section className="relative py-16 md:py-24 text-primary-foreground overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${customDesignBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-secondary/50" />
        <div className="relative container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-foreground/20 rounded-full text-sm font-medium mb-4">
            Special Service
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            Custom Design Orders
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Can't find what you're looking for? Share your vision and our Vrindavan artisans will bring it to life with love and devotion.
          </p>
        </div>
      </section>

      <CustomDesignSection />
    </div>
  );
};

export default CustomDesignPage;
