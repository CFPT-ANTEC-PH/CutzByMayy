import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export function ScrollTextVelocityHome() {
  return (
    <VelocityScroll
      text="Le meilleur sur Genève !"
      default_velocity={5}
      className="font-display text-center text-4xl font-bold tracking-[-0.02em] text-white drop-shadow-sm md:text-6xl md:leading-[4rem]"
    />
  );
}
