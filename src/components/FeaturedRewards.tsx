import { motion } from "framer-motion";
import { Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Reward {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  points: number;
}

const rewards: Reward[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max',
    description: 'The ultimate smartphone with A17 Pro chip and titanium design',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop',
    points: 50000,
  },
  {
    id: '2',
    title: 'Sony PlayStation 5',
    description: 'Next-gen gaming console with lightning-fast SSD and 4K graphics',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=400&fit=crop',
    points: 25000,
  },
  {
    id: '3',
    title: 'Apple AirPods Pro',
    description: 'Premium wireless earbuds with active noise cancellation',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=400&fit=crop',
    points: 10000,
  },
  {
    id: '4',
    title: 'Shareat Gift Hamper',
    description: 'Exclusive snack collection worth ₹5000 with premium flavors',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    points: 5000,
  },
];

const FeaturedRewards = () => {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="container px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
              <span className="text-foreground">Featured </span>
              <span className="text-primary">Rewards</span>
            </h2>
            <p className="text-muted-foreground mt-2">Discover what you can earn</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/enter">
              <Button variant="outline" className="gap-2 rounded-full px-6">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Rewards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Points Badge */}
                  <div className="absolute bottom-3 right-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg">
                      <Gift className="w-3.5 h-3.5" />
                      {reward.points.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-foreground mb-1 line-clamp-1">
                    {reward.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {reward.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRewards;
