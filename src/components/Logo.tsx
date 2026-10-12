interface LogoProps {
  className?: string;
}

/**
 * 认知矩阵网络 · 统一 Logo（方案 #2 矩阵立方）
 * 采用透明背景 PNG（public/logo.png），Header / Footer 同源引用。
 */
export default function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="认知矩阵网络"
      draggable={false}
      className={`${className} object-contain select-none`}
    />
  );
}
