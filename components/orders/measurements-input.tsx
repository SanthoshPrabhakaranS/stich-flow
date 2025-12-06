import {
  Form,
  InputNumber,
  Row,
  Col,
  Card,
  Collapse,
  Typography,
  Divider,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Ruler } from "lucide-react";

const { Panel } = Collapse;
const { Title, Text } = Typography;

interface MeasurementsInputProps {
  form: unknown;
  disabled?: boolean;
}

const measurementGroups = [
  {
    key: "basic",
    label: "Basic Measurements",
    measurements: [
      {
        key: "shoulder_width",
        label: "Shoulder Width",
        unit: "inches",
        span: 8,
      },
      { key: "bust", label: "Bust", unit: "inches", span: 8 },
      { key: "waist", label: "Waist", unit: "inches", span: 8 },
      { key: "hip", label: "Hip", unit: "inches", span: 8 },
      { key: "arm_length", label: "Arm Length", unit: "inches", span: 8 },
      { key: "sleeve_length", label: "Sleeve Length", unit: "inches", span: 8 },
    ],
  },
  {
    key: "advanced",
    label: "Advanced Measurements",
    measurements: [
      { key: "armhole", label: "Armhole", unit: "inches", span: 8 },
      { key: "neck_front", label: "Neck (Front)", unit: "inches", span: 8 },
      { key: "neck_back", label: "Neck (Back)", unit: "inches", span: 8 },
      { key: "top_length", label: "Top Length", unit: "inches", span: 8 },
      { key: "blouse_length", label: "Blouse Length", unit: "inches", span: 8 },
      { key: "skirt_length", label: "Skirt Length", unit: "inches", span: 8 },
    ],
  },
  {
    key: "custom",
    label: "Custom Measurements",
    measurements: [
      { key: "custom_1", label: "Custom 1", unit: "inches", span: 8 },
      { key: "custom_2", label: "Custom 2", unit: "inches", span: 8 },
      { key: "custom_3", label: "Custom 3", unit: "inches", span: 8 },
    ],
  },
];

export default function MeasurementsInput({
  form,
  disabled = false,
}: MeasurementsInputProps) {
  const renderMeasurementField = (measurement: {
    key: string;
    label: string;
    unit: string;
    span: number;
  }) => (
    <Col xs={24} sm={12} md={measurement.span} key={measurement.key}>
      <Form.Item
        name={["measurements", measurement.key]}
        label={
          <div className="flex items-center gap-1 justify-between">
            <span>{measurement.label}</span>
            <Text type="secondary" className="text-xs">
              ({measurement.unit})
            </Text>
          </div>
        }
      >
        <InputNumber
          placeholder={`Enter ${measurement.label.toLowerCase()}`}
          min={0}
          max={100}
          step={0.5}
          style={{ width: "100%" }}
          size="large"
          disabled={disabled}
        />
      </Form.Item>
    </Col>
  );

  return (
    <Card
      title={
        <div className="flex items-center space-x-2">
          <Ruler size={18} />
          <span>Body Measurements</span>
        </div>
      }
      size="small"
      className="mb-4"
      styles={{
        body: {
          padding: "16px",
        },
      }}
    >
      <div className="mb-4">
        <Text type="secondary">
          Enter the customer&apos;s body measurements for accurate stitching.
        </Text>
      </div>

      <Collapse
        defaultActiveKey={["basic"]}
        expandIcon={({ isActive }) => (
          <DownOutlined rotate={isActive ? 180 : 0} />
        )}
        ghost
      >
        {measurementGroups.map((group) => (
          <Panel
            header={group.label}
            key={group.key}
            className="measurement-panel"
          >
            <Row gutter={[16, 8]}>
              {group.measurements.map(renderMeasurementField)}
            </Row>
          </Panel>
        ))}
      </Collapse>

      <Divider />
    </Card>
  );
}
