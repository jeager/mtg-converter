import {
  Button,
  Checkbox,
  Dropdown,
  Flex,
  Image,
  Modal,
  Typography,
} from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { CONDITION_MAP, CONDITION_OPTIONS } from "../constants";
import type { ConversionOptions } from "../types";
import { useState } from "react";
import ligaMagicList from "../assets/lista-exemplo.png";

interface OptionsPanelProps {
  options: ConversionOptions;
  onOptionsChange: (options: ConversionOptions) => void;
  onReset: () => void;
  hasFiles: boolean;
}

export const OptionsPanel = ({
  options,
  onOptionsChange,
  onReset,
  hasFiles,
}: OptionsPanelProps) => {
  const handleOptionChange = <K extends keyof ConversionOptions>(
    key: K,
    value: ConversionOptions[K]
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <Flex vertical className="justify-center align-middle w-full !p-5 !mb-10">
      <Flex justify="space-between" align="center" className="!mb-4">
        <h2 className="text-2xl font-bold">Opções</h2>
        {hasFiles && (
          <Button danger icon={<DeleteOutlined />} onClick={onReset}>
            Resetar
          </Button>
        )}
        <Button
          icon={<QuestionCircleOutlined />}
          onClick={() => {
            setIsHelpModalOpen(true);
          }}
        >
          Como usar
        </Button>
      </Flex>
      <Flex gap="large" wrap>
        <Flex align="center" gap="small">
          <Checkbox
            checked={options.forceCondition}
            onChange={(e) =>
              handleOptionChange("forceCondition", e.target.checked)
            }
          >
            Aplicar condição
          </Checkbox>
          {options.forceCondition && (
            <Dropdown
              menu={{
                selectable: true,
                onSelect: (e) => handleOptionChange("condition", e.key),
                selectedKeys: [options.condition],
                items: CONDITION_OPTIONS.map((opt) => ({
                  key: opt.key,
                  label: opt.label,
                })),
              }}
            >
              <Typography.Link className="text-lg">
                {CONDITION_MAP[options.condition as keyof typeof CONDITION_MAP]}
              </Typography.Link>
            </Dropdown>
          )}
        </Flex>
        <Checkbox
          checked={options.ignoreEdition}
          onChange={(e) =>
            handleOptionChange("ignoreEdition", e.target.checked)
          }
        >
          Ignorar edição
        </Checkbox>
      </Flex>
      <Modal
        open={isHelpModalOpen}
        closable={{
          "aria-label": "Close help modal",
        }}
        onCancel={() => setIsHelpModalOpen(false)}
        onOk={() => setIsHelpModalOpen(false)}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Flex className="flex-col gap-2">
          <h2 className="text-2xl font-bold">
            Como usar o conversor de coleções
          </h2>
          <div>
            Primeiramente vá em{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.ligamagic.com.br/?view=colecao/export"
            >
              Exportar lista no site da Liga Magic
            </a>
          </div>
          <div>
            Em seguida selecione a lista que gostaria de exporta e exporte no
            formato <strong>Padrão LigaMagic CSV [Modelo para Coleções]</strong>{" "}
            igual no exemplo abaixo.
          </div>
          <Image src={ligaMagicList} />
          <div>
            Depois é so carregar a lista no conversor. Após isso você conseguirá
            fazer a{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.ligamagic.com.br/?view=cards/lista"
            >compra por lista no site da Liga Magic</a>
          </div>
        </Flex>
      </Modal>
    </Flex>
  );
};
