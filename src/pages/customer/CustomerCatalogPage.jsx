import { Box, Button, Flex, Grid, Input, Skeleton } from "@chakra-ui/react";
import { useState } from "react";
import { LuPackage } from "react-icons/lu";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductCard from "@/components/ui/ProductCard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function CustomerCatalogPage() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");

  // Lista de categorías con "Todos"
  const catNames = ["Todos", ...categories.map((c) => c.name)];

  // Filtrado: activos + categoría + búsqueda
  const filtered = products
    .filter((p) => p.is_active)
    .filter((p) => catFilter === "Todos" || p.category === catFilter)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <PageHeader
        title="Nuestros productos"
        subtitle={`${filtered.length} productos disponibles`}
      />

      {/* Buscador + filtros */}
      <Flex gap={3} mb={5} direction={{ base: "column", sm: "row" }}>
        <Input
          placeholder="Buscar producto…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW={{ sm: "260px" }}
          size="sm"
        />

        <Flex gap={2} flexWrap="wrap">
          {catNames.map((c) => (
            <Button
              key={c}
              size="xs"
              variant={catFilter === c ? "solid" : "outline"}
              bg={catFilter === c ? "brand.solid" : "transparent"}
              color={catFilter === c ? "white" : "text.secondary"}
              borderColor={catFilter === c ? "brand.solid" : "border.default"}
              _hover={{
                bg: catFilter === c ? "brand.600" : "bg.subtle",
              }}
              fontWeight={catFilter === c ? 600 : 400}
              onClick={() => setCatFilter(c)}
            >
              {c}
            </Button>
          ))}
        </Flex>
      </Flex>

      {/* Loading */}
      {loading ? (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} h="160px" borderRadius="xl" />
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        // Sin resultados
        <EmptyState
          icon={LuPackage}
          title="Sin productos"
          message="No hay productos que coincidan."
        />
      ) : (
        // Grid de productos
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Grid>
      )}
    </Box>
  );
}
