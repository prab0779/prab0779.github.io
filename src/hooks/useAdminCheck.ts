export const useAdminCheck = (userId: string | undefined) => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true); // stay true until resolved

  useEffect(() => {
    // Don't resolve yet if auth hasn't given us a userId
    if (userId === undefined) return; // <-- key change

    const checkAdmin = async () => {
      if (!userId) {
        setRole(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      setRole(data?.role ?? null);
      setLoading(false);
    };

    checkAdmin();
  }, [userId]);

  return { role, isAdmin: !!role, loading };
};