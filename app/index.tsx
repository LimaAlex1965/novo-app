import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type TipoFiltro = "todas" | "concluidas" | "pendentes";

export default function Index() {
  const [tarefas, setTarefas] = useState<{ id: number; titulo: string; concluido: boolean }[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState<TipoFiltro>("todas");

  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const tarefasSalvas = await AsyncStorage.getItem("tarefas");
        if (tarefasSalvas) {
          setTarefas(JSON.parse(tarefasSalvas));
        }
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      }
    };
    carregarTarefas();
  }, []);

  const salvarNoStorage = async (novasTarefas: typeof tarefas) => {
    try {
      await AsyncStorage.setItem("tarefas", JSON.stringify(novasTarefas));
    } catch (error) {
      console.error("Erro ao salvar tarefas:", error);
    }
  };

  function adicionarTarefa() {
    if (novaTarefa.trim() === "") return;

    const atualizadas = [
      ...tarefas,
      {
        id: Date.now(),
        titulo: novaTarefa.trim(),
        concluido: false,
      },
    ];

    setTarefas(atualizadas);
    salvarNoStorage(atualizadas);
    setNovaTarefa("");
  }

  function toggleTarefa(id: number) {
    const atualizadas = tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, concluido: !tarefa.concluido } : tarefa
    );

    setTarefas(atualizadas);
    salvarNoStorage(atualizadas);
  }

  // --- LÓGICA DE FILTRAGEM ---
  // Esta variável filtra as tarefas em tempo de execução sem modificar o array principal 'tarefas'
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtroAtivo === "concluidas") return tarefa.concluido;
    if (filtroAtivo === "pendentes") return !tarefa.concluido;
    return true; // Se for "todas", retorna tudo
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas tarefas</Text>
      
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa"
          value={novaTarefa}
          onChangeText={setNovaTarefa}
        />
        <Button title="Adicionar" onPress={adicionarTarefa} />
      </View>

      {/* --- BOTÕES DE FILTRO --- */}
      <View style={styles.filterRow}>
        <Pressable 
          style={[styles.filterButton, filtroAtivo === "todas" && styles.filterButtonActive]} 
          onPress={() => setFiltroAtivo("todas")}
        >
          <Text style={[styles.filterButtonText, filtroAtivo === "todas" && styles.filterButtonTextActive]}>Todas</Text>
        </Pressable>

        <Pressable 
          style={[styles.filterButton, filtroAtivo === "concluidas" && styles.filterButtonActive]} 
          onPress={() => setFiltroAtivo("concluidas")}
        >
          <Text style={[styles.filterButtonText, filtroAtivo === "concluidas" && styles.filterButtonTextActive]}>Concluídas</Text>
        </Pressable>

        <Pressable 
          style={[styles.filterButton, filtroAtivo === "pendentes" && styles.filterButtonActive]} 
          onPress={() => setFiltroAtivo("pendentes")}
        >
          <Text style={[styles.filterButtonText, filtroAtivo === "pendentes" && styles.filterButtonTextActive]}>Pendentes</Text>
        </Pressable>
      </View>

      {/* Trocamos 'data={tarefas}' por 'data={tarefasFiltradas}' */}
      <FlatList
        data={tarefasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.itemRow} onPress={() => toggleTarefa(item.id)}>
            <View style={[styles.checkbox, item.concluido && styles.checkboxConcluido]} />
            <Text style={[styles.itemText, item.concluido && styles.itemTextConcluido]}>{item.titulo}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: "#f6f7fb",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c9ccd6",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  // Estilos da linha de filtros
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#e2e5ed",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#007bff", // Cor de destaque para o botão ativo
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4f5666",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#777",
    borderRadius: 4,
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
  },
  checkboxConcluido: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  itemTextConcluido: {
    textDecorationLine: "line-through",
    color: "#777",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 24,
    fontSize: 16,
  }
});