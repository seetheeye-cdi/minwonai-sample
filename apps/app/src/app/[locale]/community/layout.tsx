export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 커뮤니티 페이지는 인증 없이 접근 가능
  return <>{children}</>;
}
