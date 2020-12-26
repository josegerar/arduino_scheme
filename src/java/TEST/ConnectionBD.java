package TEST;

import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import javax.swing.table.DefaultTableModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author Usuario
 */
public class ConnectionBD {

    String user = "postgres";
    String password = "1234567890";
    java.sql.Connection conex;
    DefaultTableModel dataModel;
    ResultSet result;
    ResultSetMetaData rsmd;
    java.sql.Statement st;

    public ConnectionBD() {

    }

    public boolean openConecction() {
        try {
            Class.forName("org.postgresql.Driver");
            conex = DriverManager.getConnection("jdbc:postgresql://156.96.46.31:5432/circuitsBD", user, password);
        } catch (Exception exc) {
            System.out.println("No connection");
            return false;
        }
        return true;
    }

    public boolean closeConnection() {
        try {
            st.close();
            conex.close();
        } catch (Exception exc) {
            System.out.println("Error close connection:" + exc.getMessage());
            return false;
        }
        return true;
    }

    public boolean closeResulSet() {
        try {
            result.close();
        } catch (SQLException ex) {
            System.out.println("error in close resulset:" + ex.getMessage());
            return false;
        }
        return true;
    }

    public DefaultTableModel returnRecord(String sentecy) {
        if (openConecction()) {
            try {
                st = conex.createStatement();
                result = st.executeQuery(sentecy);
                dataModel = new DefaultTableModel();
                rsmd = result.getMetaData();
                int n = rsmd.getColumnCount();
                for (int i = 1; i <= n; i++) {
                    dataModel.addColumn(rsmd.getColumnName(i));
                }
                String[] row = new String[n];
                while (result.next()) {
                    for (int i = 0; i < n; i++) {
                        row[i] = (result.getString(rsmd.getColumnName(i + 1)) == null) ? "" : result.getString(rsmd.getColumnName(i + 1));
                    }
                    dataModel.addRow(row);
                }
            } catch (Exception exc) {
                System.out.println("Error return Record:" + exc.getMessage());
                dataModel = null;
            } finally {
                if (result != null) {
                    closeResulSet();
                }
            };
            closeConnection();
        }
        return dataModel;
    }

    public boolean modifyBD(String sentecy) {
        if (openConecction()) {
            try {
                st = conex.createStatement();
                st.execute(sentecy);
            } catch (Exception exc) {
                System.out.println("Error ModifyBD:" + exc.getMessage());
                return false;
            }
            closeConnection();
            return true;
        } else {
            return false;
        }
    }

    public int updateDB(String sentecy) {
        int counts = 0;
        if (openConecction()) {
            try {
                st = conex.createStatement();
                counts = st.executeUpdate(sentecy);
            } catch (Exception exc) {
                System.out.println("Error UpdateBD:" + exc.getMessage());
                counts = 0;
            }
            closeConnection();
        } else {
            counts = 0;
        }
        return counts;
    }

    public String fillString(String sentecy) {
        String a = "";
        if (openConecction()) {
            try {
                st = conex.createStatement();
                result = st.executeQuery(sentecy);
                while (result.next()) {
                    a = result.getString(1);
                }

            } catch (Exception exc) {
                System.out.println("Error fill string:" + exc.getMessage());
                return "";
            } finally {
                if (result != null) {
                    closeResulSet();
                }
            };
            closeConnection();
        }
        return a;
    }

    public String getNextID(String sentecy) {
        String a = "-1";
        if (openConecction()) {
            try {
                st = conex.createStatement();
                result = st.executeQuery(sentecy);
                while (result.next()) {
                    a = result.getString(1);
                }
                int numer = 1;
                try {
                    numer = Integer.parseInt(a) + 1;
                } catch (NumberFormatException e) {
                    numer = 1;
                }
                a = numer + "";

            } catch (Exception exc) {
                System.out.println("No next id:" + exc.getMessage());
                a = "1";
            } finally {
                if (result != null) {
                    closeResulSet();
                }
            };
            closeConnection();
        }
        return a;
    }

    public String getRecordsInJson(String sentency) {
        String resul = "[";
        DefaultTableModel table = returnRecord(sentency);
        if (table != null) {
            int columCount = table.getColumnCount();
            for (int row = 0; row < table.getRowCount(); row++) {
                String line = "";
                for (int colum = 0; colum < columCount; colum++) {
                    line += "\"" + table.getColumnName(colum) + "\":\"" + table.getValueAt(row, colum).toString() + "\"";
                    if (colum < columCount - 1) {
                        line += ",";
                    }
                }
                if (line.length() > 0) {
                    resul += "{" + line + "}";
                    if (row < table.getRowCount() - 1) {
                        resul += ",";
                    }
                }
            }
            resul += "]";
        } else {
            resul = "[]";
        }
        return resul;
    }

    public boolean testConection() {
        boolean test = openConecction();
        if (test) {
            try {
                conex.close();
            } catch (SQLException ex) {
                System.out.println("error test conection:" + ex.getMessage());
            }
        }
        System.out.println("test:" + test);
        return test;
    }
}
